import React from 'react'

interface ListEcomistProps {
    data: Array<{ [key: string]: string }>; 
    OnDelete: (index:number) =>void;
    OnEdite: (index:number) =>void;
}

const ListEcomist: React.FC<ListEcomistProps> = ({data, OnDelete, OnEdite} ) => {
if(data.length === 0){
    return <p> no data available.</p>
}

const fields= Object.keys(data[0])

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
       
        <thead>
            <tr>
                {fields.map((field)=>(
                    <th className=" py-2 border-b">{field}</th>
                ))}
                            <th className="px-4 py-2 border-b">Actions</th>

            </tr>
        </thead>
        <tbody>
            {data.map((item, index) =>(
                <tr key={index}>
                    {fields.map((field)=>(
                   <td key={field} className="px-4 py-2  border-b">{item[field]}</td>
             ))}
             <td className="px-4 py-2 border-b ">
                <button  className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600" onClick={() => OnEdite(index)}>Delete</button>
                <button  className="ml-2 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600" onClick={() => OnDelete(index)}>Edite</button>
             </td>
            </tr>
            ))}
            
        </tbody>
        </table>
      </div>
  )
}

export default ListEcomist
