import FetchTags from "./tag/Fetch_Tag";
import CreateTagForm from "./tag/Form_Tag";


const CreateTag = ()=> {
  return (
    <div>
          <CreateTagForm></CreateTagForm>
          <FetchTags></FetchTags>
    </div>
  );
};

export default CreateTag;
