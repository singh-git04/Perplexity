import { ChatMistralAI } from "@langchain/mistralai";
import { HumanMessage, SystemMessage ,AIMessage, tool, createAgent} from "langchain";
import { searchInternet } from "./internet.service.js";
import * as z from "zod"



const model = new ChatMistralAI({
model: "mistral-small-latest",
apiKey: process.env.MISTRAL_APIKEY
});


const searchInternetTool = tool(

    searchInternet,
    {
        name: "searchInternet",
        description: "Use this tool to get latest information from the internet.",
        schema: z.object({
            query: z.string().describe("The query to look up on the internet.")
        })
    }
)


const agent = createAgent({
    model: model,
    tools: [searchInternetTool]
})

export async function genrateResponse(messages){

    const response = await agent.invoke({
        messages:[
            new SystemMessage(
                `You are a helpful assistant that provides accurate and relevant information if you don't know something you say you don't knowto the user. if accurate information is available, please provide it. You have access to the internet and can use the searchInternet tool to look up latest information. Please provide clear and concise responses to the user's queries.`
            ),
            ...(messages.map((message)=>{
                if(message.role==="user"){
                    return new HumanMessage(message.content)
                }else if(message.role==="ai"){
                    return new AIMessage(message.content)
                }
            }))
        ]
    })
    return response.messages[ response.messages.length - 1].text
}


export async function generateChatTitle(message) {
    const response  = await model.invoke([
        new SystemMessage(
            `You are a helpful assistant that generates a title for the chat based on the conversation. Please provide a concise and relevant title.
            
            user will provide the first message of the chat, and you will generate a title based on the essence of the conversation in 2-4 words. The title should be clear, concise, and relevant and enagaging, giving user a quick understanding of the chat's content. Please avoid using generic titles and focus on capturing the main theme or topic of the conversation.`

        ),

        new HumanMessage(
            `Genrate a title for the chat conversation based on the following first message: "${message}"
            `)
    ])

    return response.text.replace(/^["']|["']$/g, '').trim()
}