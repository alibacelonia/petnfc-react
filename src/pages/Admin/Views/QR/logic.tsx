import React, { useEffect, useState } from 'react'
import { axiosPrivate } from '../../../../api/axios'
import { PetInfo } from '../../../../flux/pets/types'

export const useLogic = () => {
    const [pageNumber, setPageNumber] = useState(1)
    const [pageLimit, setPageLimit] = useState(10)
    const [search, setSearch] = useState('')
    const [filters, setFilters] = useState('')
    const [qrData, setQrData] = useState<PetInfo[]>([])
    const [totalPages, setTotalPages] = useState(0)
    const [totalItems, setTotalItems] = useState(0)

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
        getQRCodes
    }
}


