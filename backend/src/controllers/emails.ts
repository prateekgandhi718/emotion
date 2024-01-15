import express from "express";
import axios from "axios";
import { MessageContent, saveMessageContents } from "../db/messageContents";
import { getMessageIdsBySub, saveMessageIds } from "../db/messageIds";
import { CustomRequest } from "middlewares";
import {convert} from "html-to-text"

const options = {
  wordwrap: 130,
  // ...
};

export const fetchAndSaveMessageIdsAndContents = async (
  req: CustomRequest,
  res: express.Response
) => {
  try {
    const accessToken = req.accessToken;
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };

    const today = new Date();
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 2, today.getDate());

    // Format the dates to YYYY/MM/DD as required by Gmail API
    const formattedToday = formatDate(today);
    const formattedLastMonth = formatDate(lastMonth);

    const gmailIdsAPIResponse = await axios.get(
      `https://www.googleapis.com/gmail/v1/users/me/messages?q=label:Travel in:inbox after:${`2023/01/01`} before:${`2024/01/01`}`,
      {
        headers,
      }
    ); 

    const messageIds = gmailIdsAPIResponse.data.messages.map(
      (message: any) => message.threadId
    ); // Getting the thread ids. saving the thread's first message only. Since we might have a lot of airbnb messages in it. 

    const uniqueMessageIds: string[] = [...new Set<string>(messageIds)];


    const sub = req.user.toObject().userSub;
    const savedMessages = await getMessageIdsBySub(sub);
    const savedMessageIds = savedMessages.map(
      (savedMessageObj) => savedMessageObj.messageId
    );

    //Filter the messageIds from the savedMessageIds. We should only have the message Ids which are in messageIds but not in savedMessageIds.
    const newMessageIds = uniqueMessageIds.filter(
      (messageId: string) => !savedMessageIds.includes(messageId)
    );
    console.log(newMessageIds)

    // Save these new messageIds
    const newlySavedMessageIds = await saveMessageIds(sub, newMessageIds);

    const messageContents: MessageContent[] = [];

    for (const savedMessageIdObj of newlySavedMessageIds) {
      const gmailContentAPIResponse = await axios.get(
        `https://www.googleapis.com/gmail/v1/users/me/messages/${savedMessageIdObj.messageId}`,
        {
          headers,
        }
      );

      const { labelIds, internalDate, payload } = gmailContentAPIResponse.data;

      // Exclude messages with the label "CATEGORY_PROMOTIONS"
      if (labelIds.includes("CATEGORY_PROMOTIONS")) {
        console.log(`Skipping message ${savedMessageIdObj.messageId} due to CATEGORY_PROMOTIONS label.`);
        continue;
      }

      //Prepare the object for saving
      const messageContent: MessageContent = {
        userSub: sub,
        messageId: savedMessageIdObj.messageId,
        labelIds,
        body: parseMessageBody(payload),
        internalDate,
      };
      messageContents.push(messageContent);
    }

    // Save the array containg the contents.
    const savedMessageContents = await saveMessageContents(messageContents);

    return res
      .status(200)
      .json({
        data: savedMessageContents,
        message: "Saved the new message ids and the contents",
      });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: `Error occured: ${error}` });
  }
};

const parseMessageBody = (payload:any):string => {
  console.log(payload)
  // Check if the payload directly contains the body
  if (payload.body && payload.body.size > 0 && payload.body.data) {
    const decodedBody = Buffer.from(payload.body.data, 'base64').toString('ascii');
    const plainText = payload.mimeType === 'text/plain' ? decodedBody : convert(decodedBody, options);
    return sanitizeBodyText(plainText)
  }

  // Check if parts are available
  if (payload.parts && payload.parts.length > 0) {
    for (const part of payload.parts) {
      // Check if the part contains the body and has the required MIME type
      if (
        (part.mimeType === "text/plain" || part.mimeType === "text/html") &&
        part.body &&
        part.body.size > 0 &&
        part.body.data
      ) {
        const decodedBody = Buffer.from(part.body.data, 'base64').toString('ascii');
        const plainText = payload.mimeType === 'text/plain' ? decodedBody : convert(decodedBody, options);
        return sanitizeBodyText(plainText)
      } else if (part.parts && part.parts.length > 0) {
        // If the body is nested further, recursively parse
        const body = parseMessageBody(part);
        if (body) {
          return body;
        }
      }
    }
  }

  return ""; // Return an empty string if body extraction fails
};



// Helper function to format date to YYYY/MM/DD
const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}/${month}/${day}`;
};

const sanitizeBodyText = (text: string): string => {
  // Remove HTTP and HTTPS links
  const withoutLinks = text.replace(/(https?|ftp):\/\/[^\s/$.?#].[^\s]*/gi, '');

  // Remove newline characters
  const withoutNewlines = withoutLinks.replace(/[\r\n]+/g, ' ');

  return withoutNewlines;
};