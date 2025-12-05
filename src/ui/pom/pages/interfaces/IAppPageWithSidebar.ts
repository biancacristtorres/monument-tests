import { NavigationSidebarComponent } from "../../components/NavigationSidebarComponent";
import { IAppPage } from "./IAppPage";

export interface IAppPageWithSidebar extends IAppPage {
  readonly sidebar: NavigationSidebarComponent;
}