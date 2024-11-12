import { StyleSheet, SafeAreaView, StatusBar } from "react-native"; 
import React, { useState, useCallback, useEffect } from "react"; 
import { GiftedChat } from "react-native-gifted-chat"; 
import { useRoute } from "@react-navigation/native"; 
import axios from "axios";  // For API requests 
import BASE_URL from "@/Services/GlobalApi"; 
export default function ChatScreen() { 
  const param = useRoute().params; 
  const [messages, setMessages] = useState([]); 
  const [loading, setLoading] = useState(false); 
  const [selectedChatFace, setSelectedChatFace] = useState(param.selectedFace); 
  const sessionId = param.sessionId; 
 
  useEffect(() => { 
    setMessages([ 
      { 
        _id: 1, 
        text: `Hello, I am ${selectedChatFace.name}`, 
        createdAt: new Date(), 
        user: { 
          _id: 2, 
          name: "React Native", 
          avatar: selectedChatFace.image, 
        }, 
      }, 
    ]); 
 
    // Fetch existing chat history on component mount 
    fetchChatHistory(); 
  }, [selectedChatFace]); 
 
  const fetchChatHistory = async () => { 
    try { 
      const response = await axios.get(`${BASE_URL}/chat-history/${sessionId}`); 
      const chatHistory = response.data; // Assuming this is an array of messages 
 
      // Convert chat history to GiftedChat format and append it to the chat 
      const formattedHistory = chatHistory.map((msg, index) => ({ 
        _id: index + 1, 
        text: msg.content,  // Replace msg.content with the actual message field from the response 
        createdAt: new Date(msg.timestamp), // Replace msg.timestamp with actual timestamp field 
        user: { 
          _id: msg.sender === "bot" ? 2 : 1, // Use sender field to check if it's from bot or user 
          name: msg.sender === "bot" ? "ChatBot" : "User", 
          avatar: selectedChatFace.image, 
        }, 
      })); 
 
      setMessages((previousMessages) => GiftedChat.append(previousMessages, formattedHistory)); 
    } catch (error) { 
      console.error("Error fetching chat history:", error); 
    } 
  }; 
 
  const onSend = useCallback((messages = []) => { 
    setMessages((previousMessages) => GiftedChat.append(previousMessages, messages)); 
    setLoading(true); 
 
    if (messages[0].text) { 
      sendMessageToBackend(messages[0].text); 
    } 
  }, []); 
 
  const sendMessageToBackend = async (userMessage) => { 
    try { 
      const response = await axios.post(`${BASE_URL}/chat`, { 
        input: userMessage, 
        session_id: sessionId, 
      }); 
 
      const botResponse = response.data.response; 
      const chatAPIResp = { 
        _id: Math.random() * (9999999 - 1), 
        text: botResponse, 
        createdAt: new Date(), 
        user: { 
          _id: 2, 
          name: "ChatBot", 
          avatar: selectedChatFace.image, 
        }, 
      }; 
 
      setLoading(false); 
      setMessages((previousMessages) => GiftedChat.append(previousMessages, chatAPIResp)); 
    } catch (error) { 
      console.error("Error sending message to backend:", error); 
      setLoading(false); 
      setMessages((previousMessages) => 
        GiftedChat.append(previousMessages, { 
          _id: Math.random() * (9999999 - 1), 
          text: "Sorry 🙏  No data found 😢", 
          createdAt: new Date(), 
          user: { 
            _id: 2, 
            name: "ChatBot", 
            avatar: selectedChatFace.image, 
          }, 
        }) 
      ); 
    } 
  }; 
 
  return ( 
    <SafeAreaView style={styles.chatView}> 
      <StatusBar barStyle="dark-content" /> 
      <GiftedChat 
        messages={messages} 
        isTyping={loading} 
        onSend={(messages) => onSend(messages)} 
        user={{ 
          _id: 1, 
        }} 
      /> 
    </SafeAreaView> 
  ); 
} 
 
const styles = StyleSheet.create({ 
  chatView: { 
    flex: 1, 
    marginTop: 42, 
    backgroundColor: "#fff", 
    borderRadius: 10, 
  }, 
});