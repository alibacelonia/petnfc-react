import React, { ChangeEvent, ReactNode, useEffect, useRef, useState } from 'react'
import { ProductInfo } from '../../../../flux/product/types';
import { SubmitHandler, useForm } from 'react-hook-form';
import { InputGroup, useDisclosure } from '@chakra-ui/react';
import axios from 'axios';
import { ActionMeta } from 'chakra-react-select';

export const products: ProductInfo[] = [
    {
      productId: "1",
      productName: "Pet NFC Tag",
      description:
        "This is a sample product description. Provide details about the product and its features.",
      price: 10.0,
      currency: "AUD",
      discount: {
        type: "percentage",
        value: 40,
        expirationDate: "2024-2-31",
      },
  
      freebies: ["Free shipping", "Bonus accessory"],
      category: "Electronics",
      manufacturer: "Example Manufacturer",
      imageUrl: "/assets/petqr.png",
      enabled: true,
    },
    {
      productId: "2",
      productName: "Pet NFC Tag",
      description:
        "This is a sample product description. Provide details about the product and its features.",
      price: 5.0,
      currency: "AUD",
      discount: {
        type: "fixed",
        value: 2,
        expirationDate: "2024-2-31",
      },
  
      freebies: ["Free shipping", "Bonus accessory"],
      category: "Electronics",
      manufacturer: "Example Manufacturer",
      imageUrl: "https://petnfc-storage.syd1.cdn.digitaloceanspaces.com/Screenshot%202024-01-21%20at%203.05.16%E2%80%AFAM.png",
      enabled: true,
    },
  ];

  
export type FormValues = {
    product_name: string;
    product_description: string;
    product_price: number;
    product_discount_type: string;
    product_discount_value: number;
    product_discount_expiration: Date;
    file_: FileList;
  };
  

export const useLogic = () => {

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
  } = useForm<FormValues>();

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
  const [files, setFiles] = useState<FileList | null>(null);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = event.target.files;
      setFiles(files);

      const previews: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === 'string') {
            previews.push(reader.result);
            setImagePreviews([...previews]);
          }
        };
        reader.readAsDataURL(files[i]);
      }
    }
  };

  

  const handleRemovePreview = (index: number) => {
    const newPreviews = [...imagePreviews];
    newPreviews.splice(index, 1);
    setImagePreviews(newPreviews);

    if (files) {
      let filesArr = Array.from(files);
      filesArr.splice(index, 1);

      var newFileList = new DataTransfer();
      filesArr.forEach(function(file) {
        newFileList.items.add(file);
      });

      setFiles((newFileList.files as unknown) as FileList);
    }
  };

  function createEmptyFileList(): FileList {
    return {
      length: 0,
      item(index: number): File | null {
        return null;
      },
      [Symbol.iterator]: function* () {
        yield* [];
      }
    };
  }

  const [formdata, setFormData] = useState<FormValues>({
    product_name: "",
    product_description: "",
    product_price: 0,
    product_discount_type: "fixed",
    product_discount_value: 0,
    product_discount_expiration: new Date(),
    file_: createEmptyFileList()
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

    }
  };

  const onSubmit: SubmitHandler<FormValues> = async (inputs: FormValues) => {
    // createFolder("petnfc-storage", "sample")
    console.log("On Submit: ", inputs)

    const formData = new FormData();
    for (const file of inputs.file_) {
      formData.append('files', file);
    }

    const freebies: [] = [];

    formData.append('product_name', "product_name")
    formData.append('description', "description")
    formData.append('price', "10")
    formData.append('discount', JSON.stringify({"type": "string", "value": 0, "expiration_date": "2024-03-07T09:14:01.276000+00:00"}))
    formData.append('freebies', JSON.stringify(freebies));
    formData.append('category', "category")
    formData.append('manufacturer', "manufacturer")
    formData.append('enabled', "true")

    axios.post('/product/add-product', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true
      }).then((response) => {
        console.log(response)
        alert("Done uploading...")
      }).catch((error)=>{
        alert("Error uploading.")
        console.error(error);
      });
    
  };

  const validateFiles = (value: FileList) => {
    if (value.length < 1) {
      return "Files is required";
    }
    for (const file of Array.from(value)) {
      const fsMb = file.size / (1024 * 1024);
      const MAX_FILE_SIZE = 10;
      if (fsMb > MAX_FILE_SIZE) {
        return "Max file size 10mb";
      }
    }
    return true;
  };

  useEffect(() => {
    console.log(files)
  }, [files, imagePreviews]);

  
  return {
    products,
    control,
    handleSubmit,
    register,
    errors, 
    isSubmitting,
    trigger,
    reset,
    setValue,
    setError,
    clearErrors,
    isOpenModal,
    onOpenModal,
    onCloseModal,
    formdata,
    setFormData,
    onChangeSelect,
    onChangeInput,
    onSubmit,

    isOpenAlertDialog,
    onOpenAlertDialog,
    onCloseAlertDialog,
    cancelRef,
    validateFiles,

    imagePreviews, 
    setImagePreviews,
    handleFileChange,
    handleRemovePreview,
    files,
    setFiles
  }


}

export default useLogic
