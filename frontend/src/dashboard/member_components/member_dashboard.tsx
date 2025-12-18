import { useState } from 'react';
import PublicNotes from './main_bar/public_note';
import TopNavbar from "./topnavbar";
import CreateNote from "./main_bar/create_note";
import MyNote from "./main_bar/my_note";
import MyHistory from './main_bar/my_history';
type Page = 'createNote' | 'myNotes' | 'publicNotes' | 'myHistory';

const MemberDashboard = ({ onLogout }: { onLogout: () => void }) => {
  const [page, setPage] = useState<Page>('createNote');

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Top Navbar */}
      <header className="sticky top-0 z-10">
        <TopNavbar onLogout={onLogout} />
      </header>

      {/* Navigation Buttons */}
      <nav className="bg-gray-200 p-2 flex gap-2 overflow-x-auto">


        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          onClick={() => setPage("createNote")}
        >
          Create Note
        </button>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          onClick={() => setPage("myNotes")}
        >
          My Notes
        </button>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          onClick={() => setPage("publicNotes")}
        >
          Public Notes
        </button>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          onClick={() => setPage("myHistory")}
        >
          Show History
        </button>
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-4 overflow-auto">
        {page === 'createNote' && <CreateNote goToPage={setPage} />}
        {page === 'myNotes' && <MyNote goToPage={setPage} />}
        {page === 'publicNotes' && <PublicNotes goToPage={setPage} />}
        {page === 'myHistory' && <MyHistory goToPage={setPage} />}
      </main>
    </div>
  );
};

export default MemberDashboard;
