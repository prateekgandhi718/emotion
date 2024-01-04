"use client"

import { useSession } from "next-auth/react"
import Image from "next/image"

const DocumentsPage = () => {
  const {data} = useSession()

  return (
    <div className="h-full flex flex-col items-center justify-center space-y-4">
      <Image src="/empty.png" 
      height="300"
      width="300"
      alt="empty"
      className="dark:hidden"
      />
      <Image src="/empty-dark.png" 
      height="300"
      width="300"
      alt="empty"
      className="hidden dark:block"
      />
      <h2 className="text-lg font-medium">
        Welcome to {data?.user?.name?.split(" ")[0]}&apos;s Emotion
      </h2>

    </div>
  )
}

export default DocumentsPage