import { useCollection } from 'react-firebase-hooks/firestore';
import { collection, orderBy, limit, query, addDoc, serverTimestamp } from 'firebase/firestore';
import {type FormEvent, useRef, useState} from 'react';
import { auth, firestore } from '../../services/firebase.ts';
import ChatMessage from './ChatMessage'; // Ajusta la ruta según tu estructura

function ChatRoom() {
    const dummy = useRef<HTMLSpanElement>(null);
    const messagesRef = collection(firestore, 'messages');
    const q = query(messagesRef, orderBy('createdAt'), limit(25));

    const [snapshot, loading, error] = useCollection(q);
    const [formValue, setFormValue] = useState('');

    const sendMessage = async (e: FormEvent) => {
        e.preventDefault();

        if (!auth.currentUser || !formValue.trim()) return;

        const { uid, photoURL } = auth.currentUser;

        try {
            await addDoc(messagesRef, {
                text: formValue,
                createdAt: serverTimestamp(),
                uid,
                photoURL
            });

            setFormValue('');
            dummy.current?.scrollIntoView({ behavior: 'smooth' });
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    if (loading) return <div>Loading messages...</div>;
    if (error) return <div>Error loading messages: {error.message}</div>;

    return (
        <>
            <main>
                {snapshot?.docs.map((doc) => {
                    const data = doc.data();
                    return (
                        <ChatMessage
                            key={doc.id}
                            message={{
                                id: doc.id,
                                text: data.text || '',
                                uid: data.uid || '',
                                photoURL: data.photoURL || '',
                                createdAt: data.createdAt
                            }}
                            currentUser={auth.currentUser} // Pasar el currentUser como prop
                        />
                    );
                })}
                <span ref={dummy}></span>
            </main>

            <form onSubmit={sendMessage}>
                <input
                    value={formValue}
                    onChange={(e) => setFormValue(e.target.value)}
                    placeholder="write a message..."
                />
                <button type="submit" disabled={!formValue}>↩️</button>
            </form>
        </>
    );
}

export default ChatRoom;