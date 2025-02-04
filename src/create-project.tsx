import { ActionPanel, Action, Icon, List, Image } from "@raycast/api";
import { readdirSync, mkdirSync } from "node:fs"
import { resolve } from "node:path";
import { homedir } from "node:os"; 
import { useState } from "react";
import { create } from "node:domain";

// const FOLDERS = readdirSync(resolve(`${homedir}/Developer`), {withFileTypes: true}).map((entry) => {
//   return {
//     id: entry,
//     title: entry
//   }
// })

const FOLDERS = readdirSync(resolve(`${homedir}/Developer`), {withFileTypes: true}).filter(entry => entry.isDirectory()).map(entry => {
  return {
    id: entry.name,
    title: entry.name,
    path: entry.path + "/" + entry.name
  }
})


export default function Command() {
  const [searchText, setSearchText] = useState("")
  const createProject = (folderName) => {
    mkdirSync(resolve(`${homedir}/Developer`) + `/${folderName}` )
  } 


  return (
    <List onSearchTextChange={setSearchText} filtering={true} searchBarPlaceholder="Search or create your project">
      <List.EmptyView title={`Project ${searchText} doesn't exist. Lets create it?`} icon={Icon.NewFolder} actions={
        <ActionPanel title="">
          <Action title="Create project" onAction={() => createProject(searchText)}/>
        </ActionPanel>
      }/>
      {FOLDERS.map((item) => (
        <List.Item
          key={item.id}
          title={item.title}
          subtitle={item.path}
          actions={
            <ActionPanel>
              <Action.Open target={item.path} title="Open Project" application="com.microsoft.VSCode" />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}
