import React, { ChangeEvent, useEffect, useState } from "react";
import { axiosPrivate } from "../../../../api/axios";
import { PetInfo } from "../../../../flux/pets/types";
import { UserInfo } from "../../../../flux/user/types";
import { FeeInfo } from "../../../../types";
import { SubmitHandler, useForm } from "react-hook-form";
import { ActionMeta, ChakraStylesConfig } from "chakra-react-select";
import { useDisclosure } from "@chakra-ui/react";

export type Inputs = {
  fee_type: string;
  display_name: string;
  currency: string;
  amount: number;
  operation: string;
  enabled: boolean;
};
export const chakraStyles: ChakraStylesConfig = {
  dropdownIndicator: (provided, state) => ({
    ...provided,
    background: "provided.background",
    fontSize: "16px",
  }),
  control: (provided, state) => ({
    ...provided,
    fontSize: "14px",
  }),
  option: (provided, state) => ({
    ...provided,
    fontSize: "14px",
  }),
  placeholder: (provided, state) => ({
    ...provided,
    _placeholder: "",
  }),
  multiValueLabel: (provided, state) => ({
    ...provided,
    fontSize: "14px",
  }),
  multiValue: (provided, state) => ({
    ...provided,
    fontSize: "14px",
  }),
  multiValueRemove: (provided, state) => ({
    ...provided,
    fontSize: "14px",
  }),
  crossIcon: (provided, state) => ({
    ...provided,
    fontSize: "12px",
  }),
};

export const operations = [
  { label: "Addition", value: "ADD" },
  { label: "Subtraction", value: "SUBTRACT" },
];
export const useLogic = () => {
  const [pageNumber, setPageNumber] = useState(1);
  const [pageLimit, setPageLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState("");
  const [userData, setUserData] = useState<FeeInfo[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  const [selectedFee, setSelectedFee] = React.useState("");
  const [selectedID, setSelectedID] = React.useState("");

  const [operation, setPetOperation] = useState<object | null>(null);
  const {
    isOpen: isOpenAlertDialog,
    onOpen: onOpenAlertDialog,
    onClose: onCloseAlertDialog,
  } = useDisclosure();

  const {
    isOpen: isOpenModal,
    onOpen: onOpenModal,
    onClose: onCloseModal,
  } = useDisclosure();
  const cancelRef = React.useRef<HTMLButtonElement>(null);
  const {
    control,
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    trigger,
    reset,
    setValue,
    setError,
    clearErrors,
  } = useForm<Inputs>();

  const [formdata, setFormData] = useState<Inputs>({
    fee_type: "",
    display_name: "",
    currency: "AUD",
    amount: 0,
    operation: "",
    enabled: false,
  });

  const onChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const key = name;
    setFormData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  const onChangeSelect = (newValue: unknown, action: ActionMeta<unknown>) => {
    if (typeof newValue === "object") {
      // Now we know myObject is an object
      // console.info(`newValue: `, newValue);
      // console.info(`action: `, action);
      const key: any = action.name;
      const data = JSON.stringify(newValue);
      const newData = JSON.parse(data);

      setFormData((prevData) => ({
        ...prevData,
        [key]: newData.value,
      }));

      setPetOperation(
        operations.filter((type) => {
          return type["value"].toLowerCase() == newData.value.toLowerCase();
        })
      );
    }
  };

  const getUsers = async () => {
    await axiosPrivate
      .get(
        `/fees?page=${pageNumber}&limit=${pageLimit}&search=${search}&filters=${filters}`
      )
      .then((response) => {
        setUserData(response.data.fees);
        setTotalPages(response.data.total_pages);
        setTotalItems(response.data.total_items);
      })
      .catch((error) => {});
  };

  const deleteFee = async (id: string) => {
    await axiosPrivate
      .post(`/fees/delete/${id}`)
      .then((response) => {
        getUsers();
      })
      .catch((error) => {});
  };

  const onSubmit: SubmitHandler<Inputs> = async (inputs: Inputs) => {
    console.info("formdata: ", formdata);
    let errors = 0;
    if (formdata.display_name === "") {
      errors++;
      setError("display_name", {
        type: "manual",
        message: "This field is required.",
      });
    }
    if (formdata.fee_type === "") {
      errors++;
      setError("fee_type", {
        type: "manual",
        message: "This field is required.",
      });
    }
    if (formdata.amount <= 0) {
      errors++;
      setError("amount", {
        type: "manual",
        message: "This field is required.",
      });
    }
    if (formdata.operation === "") {
      errors++;
      setError("operation", {
        type: "manual",
        message: "This field is required.",
      });
    }

    if (errors <= 0) {
      axiosPrivate
        .post(`/fees/create`, formdata)
        .then((response) => {
          onCloseModal();
          setFormData({
            fee_type: "",
            display_name: "",
            currency: "AUD",
            amount: 0,
            operation: "null",
            enabled: false,
          });
          getUsers();
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await getUsers();
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      await getUsers();
    };

    fetchData();
  }, [pageNumber, filters]);

  return {
    pageNumber,
    setPageNumber,
    pageLimit,
    setPageLimit,
    search,
    setSearch,
    filters,
    setFilters,
    totalPages,
    totalItems,
    userData,
    setUserData,
    getUsers,
    control,
    handleSubmit,
    register,
    trigger,
    reset,
    setValue,
    setError,
    clearErrors,
    errors,
    isSubmitting,
    formdata,
    setFormData,
    deleteFee,
    chakraStyles,
    operations,
    onChangeSelect,
    onChangeInput,
    onSubmit,

    isOpenAlertDialog,
    onOpenAlertDialog,
    onCloseAlertDialog,
    cancelRef,

    isOpenModal,
    onOpenModal,
    onCloseModal,

  selectedFee,
  setSelectedFee,
  selectedID,
  setSelectedID
  };
};
