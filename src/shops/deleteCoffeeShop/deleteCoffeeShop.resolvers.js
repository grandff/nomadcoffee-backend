import client from "../../client";
import {protectResolver} from "../../shared/shared.utils";

export default {
	Mutation : {
		deleteCoffeeShop : protectResolver(async(_, {id}, {loggedInUser}) => {
			try{
				
				// 지우려는 데이터가 있는지 확인			
				const shop = await client.coffeeShop.findUnique({
					where : {
						id
					},
					select : {
						userId : true
					}
				});			
				if(!shop){
					throw new Error("해당 데이터가 없습니다.");
				}else if(shop.userId !== loggedInUser.id){
					throw new Error("등록자가 일치하지 않습니다.");
				}else{
					await client.coffeeShopPhoto.deleteMany({
						where : {
							shopId : id
						}
					});
					
					await client.coffeeShop.delete({
						where : {
							id
						}
					});

					return {
						ok : true
					}
				}									
			}catch(e){
				return {
					ok : false,
					error : `삭제에 실패했습니다. ${e}`
				}
			}
		})
	}
}