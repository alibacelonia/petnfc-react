import React, { useState, useCallback, useEffect, useRef } from "react";
import { Alert, AlertIcon, AlertTitle, Icon, Select } from "@chakra-ui/react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import {
  Box,
  chakra,
  Flex,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  useColorModeValue,
} from "@chakra-ui/react";
import { ReactNode } from "react";
import {
  BsCart4,
  BsChatLeftQuote,
  BsChatSquareQuote,
  BsPerson,
  BsQrCodeScan,
} from "react-icons/bs";
import { FiServer } from "react-icons/fi";
import { GoLocation } from "react-icons/go";
import CountUp from "react-countup";
import { LuQrCode } from "react-icons/lu";
import { HiOutlineQrcode, HiOutlineUser } from "react-icons/hi";
import { IoQrCodeSharp } from "react-icons/io5";

// import { VerticalBarChart, PieChart, LineChart } from "amazing-react-charts";

import { useMemo } from "react";

import * as echarts from "echarts/core";
import {
  GridComponent,
  VisualMapComponent,
  TitleComponent,
  TooltipComponent,
  MarkPointComponent,
  AxisPointerComponent,
} from "echarts/components";
import { LineChart, PieChart, BarChart } from "echarts/charts";
import { CanvasRenderer } from "echarts/renderers";

import EChartsReact, {
  useChart,
  EChartsReactProps,
} from "echarts-for-react-fc";
import moment from "moment";
import { graphic } from "echarts";
import {
  MdOutlineChat,
  MdOutlineQrCodeScanner,
  MdQrCode,
} from "react-icons/md";
import { PiShoppingCartBold } from "react-icons/pi";
import { axiosPrivate } from "../../../../api/axios";

echarts.use([
  GridComponent,
  LineChart,
  PieChart,
  BarChart,
  CanvasRenderer,
  VisualMapComponent,
  TitleComponent,
  TooltipComponent,
  MarkPointComponent,
  AxisPointerComponent,
]);

interface StatsCardProps {
  title: string;
  stat: string;
  icon: ReactNode;
}

function StatsCard(props: StatsCardProps) {
  const { title, stat, icon } = props;
  return (
    <Stat
      px={{ base: 2, md: 4 }}
      py={"5"}
      shadow={"md"}
      rounded={"lg"}
      bgColor={"white"}
    >
      <Flex justifyContent={"space-between"} pr={1}>
        <Box pl={{ base: 2, md: 4 }}>
          <StatLabel fontWeight={"medium"} isTruncated color={"gray.700"}>
            {title}
          </StatLabel>
          <StatNumber
            fontSize={"3xl"}
            fontWeight={"semibold"}
            color={"blue.500"}
          >
            <CountUp end={parseInt(stat)} duration={1} />
          </StatNumber>
        </Box>
        <Box
          my={"auto"}
          color={useColorModeValue("gray.800", "gray.200")}
          alignContent={"center"}
        >
          {icon}
        </Box>
      </Flex>
    </Stat>
  );
}

const AdminDashboardPage = () => {
  const { chartRef, setChartOption, handleListenChartReady } = useChart();
  const [dataCounts, setDataCounts] = useState({
    'user': 0,
    'qrcode': 0,
    'feedback': 0,
    'order': 0,
  });
  const data = [
    ["2022-01-01", 15],
    ["2022-02-01", 0],
    ["2022-03-01", 0],
    ["2022-04-01", 0],
    ["2022-05-01", 0],
    ["2022-06-01", 0],
    ["2022-07-01", 32],
    ["2022-08-01", 86],
    ["2022-09-01", 29],
    ["2022-10-01", 61],
    ["2022-11-01", 44],
    ["2022-12-01", 71],
    ["2023-01-01", 15],
    ["2023-02-01", 93],
    ["2023-03-01", 42],
    ["2023-04-01", 71],
    ["2023-05-01", 59],
    ["2023-06-01", 12],
    ["2023-07-01", 22],
    ["2023-08-01", 82],
    ["2023-09-01", 97],
    ["2023-10-01", 68],
    ["2023-11-01", 4],
    ["2023-12-01", 85],
    ["2024-01-01", 72],
    ["2024-02-01", 89],
    ["2024-03-01", 56],
  ];

  const getDashboardDataCounts = async () => {
    await axiosPrivate
      .get(`/dashboard/dashboard-data-counts`)
      .then((response) => {
        console.log(response.data.qrcode);
        setDataCounts({
          'user': response.data.user.total,
          'qrcode': response.data.qrcode.total,
          'feedback': response.data.feedback.total,
          'order': response.data.order.total,
        });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const randomizeData = (d: any) => {
    const randomizedData = d.map((month: any[]) => {
      const randomValue = Math.floor(Math.random() * 100); // Generate a random value between 0 and 99
      return [month[0], randomValue]; // Keep the date unchanged and replace the value with the random one
    });

    return randomizedData;
  };

  const dateList = data.map(function (item) {
    return item[0];
  });
  const valueList = randomizeData(data).map(function (item: any[]) {
    return item[1];
  });
  const valueList2 = randomizeData(data).map(function (item: any[]) {
    return item[1];
  });

  useEffect(() => {
    setChartOption({
      toolbox: {
        feature: {
          saveAsImage: {},
        },
      },
      legend: {
        data: ["Registered User", "Registered Pets"],
        top: 30,
      },
      dataZoom: [
        {
          type: "slider",
          moveHandleSize: 5,
        },
      ],
      title: [
        {
          left: "center",
          text: "User Registration Summary",
          textStyle: {
            color: "#475569",
            fontFamily: "Poppins",
            fontWeight: "bold",
          },
        },
      ],
      tooltip: {
        trigger: "axis",
        formatter: function (params: any) {
          console.log(params);
          const title = moment(params[0].axisValue).format("MMM YYYY");
          const value = params[0].value;
          const value2 = params[1].value;
          const marker = params[0].marker;
          const marker2 = params[1].marker;
          return `<div class="tooltip" style="width: 175px;">
              <h1 style="font-weight: 900;">${title}</h1>
              <div style="display: flex; gap: 2; align-items: center; justify-content: space-between;">
              <div>${marker} Registered Users</div> <span style="font-weight: 900;">${value}</span>
              </div>

              <div style="display: flex; align-items: center; justify-content: space-between;">
              <div>${marker2} Registered Pets</div> <span style="font-weight: 900;">${value2}</span>
              </div>
            </div>`;
        },
      },
      xAxis: {
        type: "category",
        boundaryGap: false,
        axisLabel: {
          formatter: function (value: moment.MomentInput) {
            return moment(value).format("MMM");
          },
        },
        data: dateList,
      },
      yAxis: {
        type: "value",
      },

      series: [
        {
          name: "Registered User",
          data: valueList,
          smooth: true,
          type: "line",
          itemStyle: {
            color: new graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: "#3b82f6",
              },
              {
                offset: 1,
                color: "#bae6fd",
              },
            ]),
          },
          lineStyle: {
            color: new graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: "#3b82f6",
              },
              {
                offset: 1,
                color: "#bae6fd",
              },
            ]),
          },

          emphasis: {
            focus: "none",
          },
        },

        {
          name: "Registered Pets",
          data: valueList2,
          smooth: true,
          type: "line",
          itemStyle: {
            color: new graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: "#f97316",
              },
              {
                offset: 1,
                color: "#fde68a",
              },
            ]),
          },
          lineStyle: {
            color: new graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: "#f97316",
              },
              {
                offset: 1,
                color: "#fde68a",
              },
            ]),
          },
          emphasis: {
            focus: "none",
          },
        },
      ],
      grid: {
        left: "3%",
        top: 70,
        right: "3%",
        bottom: 80,
        containLabel: true,
      },
    });
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      await getDashboardDataCounts();
    };

    fetchData();
  }, []);

  return (
    <>
      <div className="relative ml-0 md:ml-60 bg-yello-200 py-4 px-4 md:px-10 z-10">
        {/* <div className="flex items-end min-w-full justify-between h-12">
          <h1 className="pl-2 md:pl-0 text-xl md:text-2xl tracking-normal font-bold text-gray-700">
            Dashboard
          </h1>
        </div> */}
        <div className="relative">
          <div className="">
            <SimpleGrid
              columns={{ base: 1, md: 2, lg: 4 }}
              spacing={{ base: 5, lg: 8 }}
            >
              <StatsCard
                title={"Users"}
                stat={dataCounts.user.toString()}
                // icon={<BsPerson size={"2.5em"}  color="blue.500"/>}
                icon={
                  <Icon as={HiOutlineUser} w={10} h={10} color="blue.500" />
                }
              />
              <StatsCard
                title={"QR Codes"}
                stat={dataCounts.qrcode.toString()}
                // icon={<BsQrCodeScan size={"2.5em"}  color="blue.500"/>}
                icon={
                  <Icon
                    as={MdOutlineQrCodeScanner}
                    w={9}
                    h={9}
                    color="blue.500"
                  />
                }
              />
              <StatsCard
                title={"Feedbacks"}
                stat={dataCounts.feedback.toString()}
                // icon={<BsChatSquareQuote size={"2.5em"}  color="blue.500"/>}
                icon={<Icon as={MdOutlineChat} w={9} h={9} color="blue.500" />}
              />
              <StatsCard
                title={"Orders"}
                stat={dataCounts.order.toString()}
                icon={
                  <Icon
                    as={PiShoppingCartBold}
                    w={10}
                    h={10}
                    color="blue.500"
                  />
                }
              />
            </SimpleGrid>
          </div>
        </div>

        <div className="bg-white mt-5 pt-6 px-6 shadow-md rounded-lg ">
          <div className="flex items-start justify-start mb-2">
            <Select width={150} fontSize={12} defaultValue={"All"}>
              <option value="All">All Time</option>
              <option value="2023">2023</option>
              <option value="2024">2024</option>
            </Select>
          </div>
          <EChartsReact
            style={{
              padding: 0,
              margin: 0,
              width: "100%",
              height: 500,
            }}
            ref={chartRef}
            echarts={echarts}
            onChartReady={handleListenChartReady}
          />
        </div>
      </div>
    </>
  );
};

export default AdminDashboardPage;
