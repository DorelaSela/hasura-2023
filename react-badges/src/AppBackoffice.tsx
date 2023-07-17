import React from "react";
import { RouteProps } from "react-router-dom";

import {
  SupervisorAccount as ManagersIcon,
  Engineering as EngineersIcon,
  Security as ShieldIcon
} from "@mui/icons-material";

import AppEntrypoint, { BackofficeIcon } from "./containers/AppEntrypoint";

import { DrawerMenu } from "./layouts/BasicLayout";
import Managers from "./components/Backoffice/Manager/ManagerList/Managers";
import AddManager from "./components/Backoffice/Manager/AddManager/AddManager";
import EditManager from "./components/Backoffice/Manager/EditManager/EditManager";
import Engineers from "./components/Backoffice/Engineers/EngineerData/Engineers";
import CreateEngineers from "./components/Backoffice/Engineers/CreateEngineers/CreateEngineers";
import Badges from "./components/Backoffice/Badges/Badges";
import CreateBadge from "./components/Backoffice/Badges/CreateBadge";

const menuItems = [
  {
    link: "managers",
    text: "managers",
    icon: <ManagersIcon />
  },
  {
    link: "engineers",
    text: "Engineers",
    icon: <EngineersIcon />
  },
  {
    link: "badges",
    text: "Badges Definitions",
    icon: <ShieldIcon />
  }
];

const AppBackoffice: React.FC = () => (
  <AppEntrypoint
    icon={<BackofficeIcon />}
    title={"Backoffice"}
    defaultRoute="managers"
    drawerContents={[<DrawerMenu title="Backoffice:" items={menuItems} />]}
    mobileUtils={menuItems}
    routes={
      [
        {
          path: "managers",
          element: <Managers />
        },
        {
          path: "/managers/create",
          element: <AddManager />
        },
        {
          path: "managers/:id/edit",
          element: <EditManager />
        },
        {
          path: "engineers",
          element: <Engineers />
        },
        {
          path: "/engineers/create",
          element: <CreateEngineers />
        },
        {
          path: "badges",
          element: <Badges />
        },
        {
          path: "/create",
          element: <CreateBadge />
        }
      ] as RouteProps[]
    }
  />
);

export default AppBackoffice;
