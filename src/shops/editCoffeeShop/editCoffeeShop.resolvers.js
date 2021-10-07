import client from "../../client";
import {protectResolver} from "../../shared/shared.utils";
import { processCategories } from '../shops.utils';
import { uploadToS3 } from '../../shared/shared.utils';

export  default {
	Mutation : {
		editCoffeeShop : protectResolver(async(_, {id,name,caption,latitude,longitude,file}, {loggedInUser}) => {
			try{
				// caption 값을 수정하려는지 확인
				let oldData;
				let fileUrl = null;				
				let categoriesObjs = [];
				
				if(caption){
					// 이전 카테고리 정보
					// 만약 있다면 이전에 가지고 있던 category를 disconnect 해야함	
					oldData = await client.coffeeShop.findFirst({
						where : {
							id,
							userId : loggedInUser.id
						},
						include:{
							categories : {
								select : {
									category : true
								}
							}
						}
					});
					
					categoriesObjs = processCategories(caption);					
				}
				
				// 업로드한 파일 수정하는지 확인
				if(file){
					fileUrl = await uploadToS3(file, loggedInUser.id, 'uploads');	
				}
				
				// 데이터 수정
				const coffeeShop = await client.coffeeShop.update({
					where : {
						id
					},
					data : {
						name : (name !== "undefined" ? name : oldData.name),
						caption : (caption !== "undefined" ? caption : oldData.caption),						
						...(categoriesObjs.length > 0 && {
							categories : {		// 이전 category 제거 및 새로운 카테고리 추가
								disconnect : oldData.categories,
								connectOrCreate : categoriesObjs,								
							}	
						}),
						...(fileUrl !== null && {
							photos : {
								update : {
									url : fileUrl
								}
							}
						})
					}
				});
				
				if(coffeeShop){
					return {
						ok : true
					}
				}
			}catch(e){
				return {
					ok : false,
					error : `데이터 수정에 실패했습니다. ${e}`
				}
			}		
		})
	}
}