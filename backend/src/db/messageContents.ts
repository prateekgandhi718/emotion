import mongoose from "mongoose";
import fs from 'fs';

export interface MessageContent {
    userSub: string;
    messageId: string;
    labelIds: string[];
    body: string;
    internalDate: string;
}

const MessageContentSchema = new mongoose.Schema({
    userSub: {type: String, required: true},
    messageId: {type: String, required: true},
    labelIds: {type: [String], required: true},
    body: {type: String, required: false},
    internalDate: {type: String, required: true},
})

export const MessageContentModel = mongoose.model("MessageContent", MessageContentSchema)

// Methods
export const getAllMessagesForTheUser = (sub: string) => MessageContentModel.find({userSub: sub}) 

export const saveMessageContents = async (messageContents: MessageContent[]) => {
    try {
        const savedContents =  await MessageContentModel.insertMany(messageContents)
        return savedContents
    } catch (error) {
        throw new Error(`Error saving message contents: ${error}`)
    }
}

export const exportBodyDataToTextFile = async (sub: string) => {
    // This is to prepare the training data.
    try {
      const messages = await MessageContentModel.find({userSub: sub}, 'body');
  
      const textContent = messages.map(message => message.body).join('\nxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx\n');
  
      // Replace 'output.txt' with the desired output file name
      fs.writeFileSync('output.txt', textContent, 'utf-8');
  
      console.log('Export successful. Check output.txt for the content.');
    } catch (error) {
      throw new Error(`Error saving message contents: ${error}`);
    }
  }