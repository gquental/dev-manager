import { ActionPanel, Action, Icon, List, Image, confirmAlert } from "@raycast/api";
import { readdirSync, mkdirSync, rmSync } from "node:fs"
import { resolve } from "node:path";
import { homedir } from "node:os"; 
import { useState, useCallback } from "react";

import { showToast, Toast, open, closeMainWindow, popToRoot } from "@raycast/api";

const getFolders = () => {
  return readdirSync(resolve(`${homedir}/Developer`), {withFileTypes: true})
    .filter(entry => entry.isDirectory())
    .map(entry => {
      return {
        id: entry.name,
        title: entry.name,
        path: entry.path + "/" + entry.name
      }
    });
};

export default function Command() {
  const [searchText, setSearchText] = useState("");
  const [folders, setFolders] = useState(getFolders());
  
  const refreshFolders = useCallback(() => {
    setFolders(getFolders());
  }, []);
  
  const createProject = (folderName: string) => {
    let folder = resolve(`${homedir}/Developer`) + `/${folderName}` 
    mkdirSync(folder)

    showToast({
      style: Toast.Style.Success,
      title: "Project created"
    })

    open(folder, "com.todesktop.230313mzl4w4u92")
    popToRoot({clearSearchBar: true})
  } 

  const deleteProject = async (projectPath: string, projectName: string) => {
    const options = {
      title: "Deletar Projeto",
      message: `Tem certeza que deseja deletar o projeto "${projectName}"?`,
      primaryAction: {
        title: "Deletar",
      },
    };

    if (await confirmAlert(options)) {
      try {
        rmSync(projectPath, { recursive: true, force: true });
        
        showToast({
          style: Toast.Style.Success,
          title: "Projeto deletado com sucesso"
        });
        
        // Atualiza a lista de projetos após a deleção
        refreshFolders();
      } catch (error) {
        showToast({
          style: Toast.Style.Failure,
          title: "Erro ao deletar projeto",
          message: String(error)
        });
      }
    }
  }

  return (
    <List onSearchTextChange={setSearchText} filtering={true} searchBarPlaceholder="Search or create your project">
      <List.EmptyView title={`Project ${searchText} doesn't exist. Lets create it?`} icon={Icon.NewFolder} actions={
        <ActionPanel title="">
          <Action title="Create project" onAction={() => createProject(searchText)}/>
        </ActionPanel>
      }/>
      {folders.map((item) => (
        <List.Item
          key={item.id}
          title={item.title}
          subtitle={item.path}
          actions={
            <ActionPanel>
              <Action.Open target={item.path} title="Open Project" application="com.todesktop.230313mzl4w4u92" />
              <Action
                title="Deletar Projeto"
                icon={Icon.Trash}
                onAction={() => deleteProject(item.path, item.title)}
                shortcut={{ modifiers: ["cmd", "shift"], key: "backspace" }}
              />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}
