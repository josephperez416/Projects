import { APIRequest, JSONRequest } from "./rest";
import * as App from "./app";
import { team } from "../../ts-models/team";

const dispatch = App.createDispatch();
export default dispatch.update;

dispatch.addMessage("TeamSelected", (msg: App.Message) => {
  
  const { team } = msg as App.TeamSelected;


  return new APIRequest()
    .get(`/team/${team}`)
    .then((response: Response) => {
      if (response.status === 200) {
        return response.json();
      }
      return undefined;
    })
    .then((json: unknown) => {
      if (json) {
        console.log("Team:", json);
        return json as team;
      }
    })
    .then((Team: team | undefined) =>
      Team ? App.updateProps({ team }) : App.noUpdate
    );
});

