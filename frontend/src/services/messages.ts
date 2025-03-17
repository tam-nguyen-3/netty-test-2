import axios from 'axios'
import { Message } from '../types'

const baseUrl = 'http://localhost:3001/messages';

// Function to fetch all messages
const getAll = async (): Promise<Message[]> => {
  const response = await axios.get<Message[]>(baseUrl);
  return response.data;
};

// Function to create a new message
const create = async (newMessage: Message): Promise<Message> => {
  const response = await axios.post<Message>(baseUrl, newMessage);
  return response.data;
};

export default { getAll, create };
