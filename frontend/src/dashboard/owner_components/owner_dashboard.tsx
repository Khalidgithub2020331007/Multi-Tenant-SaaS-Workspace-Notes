import { useState } from 'react';
import CreateNote from "./main_bar/create_note";
import CreateWorkSpace from "./main_bar/create_workspace";
import CreateTag from "./main_bar/create_tag";
import MyNote from "./main_bar/my_note";
import PublicNotes from "./main_bar/public_note";
import ShowHistory from "./main_bar/show_history";
import TopNavbar from "./topnavbar";

type Page = 'createWorkspace' | 'createTag' | 'createNote' | 'myNotes' | 'publicNotes' | 'showHistory';

const OwnerDashboard = ({ onLogout }: { onLogout: () => void }) => {
  const [page, setPage] = useState<Page>('createWorkspace');

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
          onClick={() => setPage("createWorkspace")}
        >
          Create Workspace
        </button>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          onClick={() => setPage("createTag")}
        >
          Create Tag
        </button>
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
          onClick={() => setPage("showHistory")}
        >
          Show History
        </button>
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-4 overflow-auto">
        {page === 'createWorkspace' && <CreateWorkSpace  />}
        {page === 'createTag' && <CreateTag />}
        {page === 'createNote' && <CreateNote />}
        {page === 'myNotes' && <MyNote />}
        {page === 'publicNotes' && <PublicNotes  />}
        {page === 'showHistory' && <ShowHistory  />}
      </main>
    </div>
  );
};

export default OwnerDashboard;
