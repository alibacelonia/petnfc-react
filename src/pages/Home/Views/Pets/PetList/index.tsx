import { AiOutlinePlus } from "react-icons/ai";
import PetListItem from "./PetItem/PetItem";
import { PetInfo } from "../../../../../flux/pets/types";

interface PetListProps{
    data: PetInfo[];
}

export default function PetCardList({ data }: PetListProps) {
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 mt-5">
        {data.map((pet) => {
          return (
            <PetListItem
              key={pet['unique_id']}
              data={pet}
            />
          );
        })}
      </div>
    </>
  );
}
