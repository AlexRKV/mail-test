import MainLayout from "../layouts/MainLayout";
import MailSection from "pages/MailSection";
import { INCOMING, MAILBOX } from "src/const";

const routes = [
  {
    path: "/",
    component: MainLayout,
    redirect: `/${MAILBOX}/${INCOMING}`,
    children: [
      {
        path: `${MAILBOX}/:section/:action?/:id?`,
        component: MailSection,
        props: true,
      },
    ],
    props: true,
  },
];

export default routes;
