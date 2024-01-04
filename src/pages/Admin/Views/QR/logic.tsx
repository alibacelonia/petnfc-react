import React, { useEffect, useState } from 'react'
import { axiosPrivate } from '../../../../api/axios'
import { PetInfo } from '../../../../flux/pets/types'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useDisclosure } from '@chakra-ui/react'


export type Inputs = {
    number_records: number;
}

interface AlertResponse {
    status: "loading" | "info" | "warning" | "success" | "error" | undefined;
    title: string;
    message: string;
  }

export const useLogic = () => {
    const [pageNumber, setPageNumber] = useState(1)
    const [pageLimit, setPageLimit] = useState(10)
    const [search, setSearch] = useState('')
    const [filters, setFilters] = useState('')
    const [qrData, setQrData] = useState<PetInfo[]>([])
    const [totalPages, setTotalPages] = useState(0)
    const [totalItems, setTotalItems] = useState(0)

    const [generateData, setGenerateData] = useState<Inputs>({
        number_records: 1
    });

    const [alertResponse, setAlertResponse] = useState<AlertResponse>({
        status: undefined,
        title: "",
        message: "",
      });

      const { isOpen: isOpenGenerateModal, onOpen: onOpenGenerateModal, onClose: onCloseGenerateModal } = useDisclosure();

      const {
        isOpen: isAlertOpen,
        onClose: onCloseAlert,
        onOpen: onOpenAlert,
      } = useDisclosure({ defaultIsOpen: false });
      
    const {
        handleSubmit: handleGenerateSubmit,
        register: registerGenerate,
        formState: { errors: errorsGenerate, isSubmitting: isGenerateSubmitting },
        reset: resetGenerate,
      } = useForm<Inputs>()

      const onSubmitGenerate: SubmitHandler<Inputs> = async (inputs: Inputs) => {
        const { number_records } = inputs
        try {
            const response = await axiosPrivate
                .post(`/pet/generate-records?num_records=${generateData.number_records}`, {})

            const generated = response?.data;

            setAlertResponse({
                "status": "success",
                "title": "QR Code Generated Successfully!",
                "message": "Congratulations! You have successfully generated a QR code. Use it wisely and securely share information with ease.",
            });
            setGenerateData({number_records: 1});
            onOpenAlert();
            onCloseGenerateModal();
            getQRCodes();
        }
        catch (error: any) {
            console.error(error)
            switch (error.code) {
                case "ERR_NETWORK":
                    setAlertResponse({
                        "status": "error",
                        "title": "Connection Timeout",
                        "message": "Connection timeout. No response from server.",
                    });
                    onOpenAlert();
                    onCloseGenerateModal();
                    break;
                case "ERR_BAD_REQUEST":
                    setAlertResponse({
                        "status": "error",
                        "title": "Connection Timeout",
                        "message": "Connection timeout. No response from server.",
                    });
                    onOpenAlert();
                    onCloseGenerateModal();
                    break;
                default:
                    setAlertResponse({
                        "status": "error",
                        "title": "Connection Timeout",
                        "message": "Connection timeout. No response from server.",
                    });
                    onOpenAlert();
                    onCloseGenerateModal();
            }

        }
    
    }

    const getQRCodes = async () => {
        await axiosPrivate.get(`/pet?page=${pageNumber}&limit=${pageLimit}&search=${search}&filters=${filters}`)
        .then((response)=>{
            setQrData(response.data.pets)
            setTotalPages(response.data.total_pages)
            setTotalItems(response.data.total_items)
        })
        .catch((error)=>{
            
        })
    }

    useEffect(() => {
        const fetchData = async () => {
            await getQRCodes();
        };
    
        fetchData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            await getQRCodes();
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
        qrData, 
        setQrData,
        getQRCodes,
        registerGenerate,
        errorsGenerate,
        isGenerateSubmitting,
        onSubmitGenerate,
        handleGenerateSubmit,
        resetGenerate,
        alertResponse,
        generateData,
        setGenerateData,
      isOpenGenerateModal,
      onOpenGenerateModal,
      onCloseGenerateModal,
      isAlertOpen,
      onCloseAlert,
      onOpenAlert
    }
}


