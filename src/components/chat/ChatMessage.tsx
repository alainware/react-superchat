import type { User } from 'firebase/auth';

interface Message {
    id: string;
    text: string;
    uid: string;
    photoURL: string;
    createdAt: any;
}

interface ChatMessageProps {
    message: Message;
    currentUser: User | null;
}

function ChatMessage({ message, currentUser }: ChatMessageProps) {
    const { text, uid, photoURL } = message;
    const messageClass = uid === currentUser?.uid ? 'sent' : 'received';

    return (
        <div className={`message ${messageClass}`}>
            <img
                src={photoURL || 'https://api.adorable.io/avatars/23/abott@adorable.png'}
                alt="User avatar"
            />
            <p>{text}</p>
        </div>
    );
}

export default ChatMessage;