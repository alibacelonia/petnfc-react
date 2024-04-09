import { Divider, Switch } from "@chakra-ui/react";
import { Tab } from "@headlessui/react";
import React, { useContext, useEffect, useState } from "react";
import {
  HiChevronRight,
  HiFingerPrint,
  HiOutlineEnvelope,
  HiOutlineLockClosed,
  HiOutlinePhone,
} from "react-icons/hi2";
import AccountSettingsPage from "./Account/Views";
import NotificationSettingsPage from "./Notification/Views";
import SecuritySettingsPage from "./Security/Views";
import { UserInfoContext } from "../../../../flux/user/store";
import { UserInfo } from "../../../../flux/user/types";
import { useSettings } from "../../../../hooks/useSettings";

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

const SettingsPage = () => {
  let [categories] = useState({
    Account: {
      id: 1,
      content: <AccountSettingsPage />,
    },

    Notification: {
      id: 2,
      content: <NotificationSettingsPage />,
    },
    Security: {
      id: 3,
      content: <SecuritySettingsPage />,
    },
  });

  // const { userState, userDispatch } = useContext(UserInfoContext);

  // const [settings, updateSettings] = useSettings();
  // const [userInfo, setUserInfo] = useState<UserInfo>(userState.userInfo);

  

  return (
    <>
      <div className="relative ml-0 md:ml-60 bg-yello-200 py-4 px-4 md:px-10 z-10">
        <div className="flex items-end min-w-full justify-between h-12">
          <h1 className="pl-2 md:pl-0 text-xl md:text-2xl tracking-normal font-bold text-gray-700">
            Settings
          </h1>
        </div>
        <div className="relative bg-white p-3 rounded-xl mt-5  mb-8">
          <div className="w-full bg-red-0300 ">
            <Tab.Group>
              <Tab.List className="flex bg-slate-100 rounded-xl p-2 overflow-x-scroll  overflow-hidden w-full max-w-full">
                {Object.keys(categories).map((category) => (
                  <Tab
                    key={category}
                    className={({ selected }) =>
                      classNames(
                        "w-full rounded-lg py-2.5 px-5  font-semibold leading-5",

                        "whitespace-nowrap", // Prevent text from wrapping
                        "ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2",
                        selected
                          ? "bg-sky-600 text-white shadow"
                          : "text-gray-700"
                      )
                    }
                  >
                    {category}
                  </Tab>
                ))}
              </Tab.List>
              <Tab.Panels className="mt-2">
                {Object.values(categories).map((element) => (
                  <Tab.Panel
                    key={element.id}
                    className={classNames("rounded-xl bg-white ", "")}
                  >
                    {element.content}
                  </Tab.Panel>
                ))}
              </Tab.Panels>
            </Tab.Group>
          </div>
        </div>
      </div>
    </>
  );
};

export default SettingsPage;
