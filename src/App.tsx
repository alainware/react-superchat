import './App.css'
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from './services/firebase.ts';
import SignOut from "./components/auth/SignOut.tsx";
import ChatRoom from '../src/components/chat/ChatRoom.tsx';
import SignIn from '../src/components/auth/SignIn.tsx';

function App() {
    const [user] = useAuthState(auth);

    return (
        <div className="App">
            <header>
                <h1>Live Chat Room</h1>
                <SignOut />
            </header>

            <section>
                {user ? <ChatRoom /> : <SignIn />}
            </section>

        </div>
    );
}

export default App;