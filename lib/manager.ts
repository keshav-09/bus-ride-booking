
import { prisma } from "@/lib/db"; 


export async function createManager(name, email) {
  try {
    const newManager = await prisma.manager.create({
      data: {
        name,
        email,
      },
    });
    return newManager;
  } catch (error) {
    throw new Error("Failed to create manager");
  }
}


export async function getAllManagers(page , limit) {
    try {
      
      const managers = await prisma.manager.findMany({
        skip: (page - 1) * limit, 
        take: limit, 
        orderBy: {
          id: 'desc', 
        },
       
      });
  
  
      const totalManagers = await prisma.manager.count(); 

      return { managers, total: totalManagers };
    } catch (error) {
      throw new Error("Failed to fetch managers");
    }
  }
  

export async function updateManager(id, name, email) {
  try {
    const updatedManager = await prisma.manager.update({
      where: { id },
      data: { name, email },
    });
    return updatedManager;
  } catch (error) {
    throw new Error("Failed to update manager");
  }
}

export async function deleteManager(id) {
  try {
    await prisma.manager.delete({
      where: { id },
    });
    return { message: "Manager deleted" };
  } catch (error) {
    throw new Error("Failed to delete manager");
  }
}
