import {
  Avatar,
  useBreakpointValue,
  useAvatarStyles,
  AvatarProps,
  Divider,
} from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import { BiEditAlt } from "react-icons/bi";
import { HiOutlinePencil } from "react-icons/hi2";
import { UserInfoContext } from "../../../../flux/user/store";
import { UserInfo } from "../../../../flux/user/types";
import { changePage } from "../../../../flux/navigation/action";
import { PageInfoContext } from "../../../../flux/navigation/store";
import { axiosPrivate } from "../../../../api/axios";
import moment from "moment";
import { FaRegBell } from "react-icons/fa6";

interface NotificationObject {
  to: string;
  message: string;
  created_at: string;
  is_read: boolean;
}

const NotificationPage = () => {
  const { userState } = React.useContext(UserInfoContext);
  const { pageDispatch } = React.useContext(PageInfoContext);
  const userInfo: UserInfo = userState?.userInfo;

  const [notifications, setNotifications] = useState<NotificationObject[]>([]);

  const getUsers = async () => {
    await axiosPrivate
      .get(`/pet/${userInfo.id}/notifications/load`)
      .then((response) => {
        setNotifications(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const avatarSize = useBreakpointValue({ base: "xl", lg: "2xl" });

  useEffect(() => {
    const fetchData = async () => {
      await getUsers();
    };

    fetchData();
  }, [userInfo]);

  return (
    <>
      <div className="relative ml-0 md:ml-60 bg-yello-200 py-4 px-4 md:px-10 z-10">
        <div className="flex items-end min-w-full justify-between h-12">
          <h1 className="pl-2 md:pl-0 text-xl md:text-2xl tracking-normal font-bold text-gray-700">
            Notifications
          </h1>
        </div>

        <div className="mt-8">
          {
            notifications.length > 0 ? 
            notifications.map((item) => {
                return (
                  <div key={item.created_at}>
                    <div className="flex justify-start items-center gap-4 mb-2">
                      {/* <div className="h-4 w-4 bg-sky-600 rounded-full grow-0"></div> */}
                      <div className="flex flex-col  bg-white p-5 pl-8 grow">
                        <h1 className="font-bold text-gray-700 tracking-[0.1em]">
                          Pet Tag Scanned
                        </h1>
                        <time className="text-sm text-sky-600 tracking-[0.1em]">
                          {moment(item.created_at).format("LLL")}
                        </time>
                        <div
                          className="text-sm tracking-[0.1em]"
                          dangerouslySetInnerHTML={{ __html: item.message }}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              }):

              <div className="flex flex-col justify-center items-center h-72 gap-2">
                <h1 className="text-gray-400"><FaRegBell size={40}/></h1>
                <h1 className="text-gray-400">No notifications yet.</h1>
              </div>
              
          }
        </div>
      </div>
    </>
  );
};

export default NotificationPage;
