import React, { useEffect, useState } from 'react'
import { axiosPrivate } from '../../../../api/axios'
import { PetInfo } from '../../../../flux/pets/types'
import { UserInfo } from '../../../../flux/user/types'

export const useLogic = () => {
    const [pageNumber, setPageNumber] = useState(1)
    const [pageLimit, setPageLimit] = useState(10)
    const [search, setSearch] = useState('')
    const [filters, setFilters] = useState('')
    const [userData, setUserData] = useState<UserInfo[]>([])
    const [totalPages, setTotalPages] = useState(0)
    const [totalItems, setTotalItems] = useState(0)

    const getUsers = async () => {
        await axiosPrivate.get(`/user?page=${pageNumber}&limit=${pageLimit}&search=${search}&filters=${filters}`)
        .then((response)=>{
            setUserData(response.data.users)
            setTotalPages(response.data.total_pages)
            setTotalItems(response.data.total_items)
        })
        .catch((error)=>{
            
        })
    }

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
        getUsers
    }
}


