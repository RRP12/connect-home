// app/ChatbotClient.js (Client-side component)

// Client component that receives data from the server
function ChatbotClient({ responseMessage }) {
  return (
    <div>
      <h1>{responseMessage}</h1>
      <button onClick={() => {}}>Get Data</button>
    </div>
  )
}

export default ChatbotClient
