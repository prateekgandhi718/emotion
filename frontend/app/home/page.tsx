"use client"
import { useGetHelloQuery } from "@/redux/api/emotionApi"
import { useSession } from "next-auth/react"

const HomePage = () => {
   const {data, isLoading, isError, error} = useGetHelloQuery(2)

   {isLoading && (
    <h1>loading...</h1>
   )
   }

  return (
    isError && (
        <h1>{(error as any).data}</h1>
    )
  )
}

export default HomePage