import client from "../../client";
import {protectResolver} from "../../shared/shared.utils";
import { processCategories } from '../shops.utils';
import { uploadToS3 } from '../../shared/shared.utils';

export default {
	Mutation : {
		createCoffeeShop : protectResolver(async(_, {name, caption, latitude, longitude, file}, {loggedInUser}) => {		
			// category 추출하기
			let categoriesObjs = [];
			if(caption){
				categoriesObjs = processCategories(caption);
			}

			// file Url 가져옴
			const fileUrl = await uploadToS3(file, loggedInUser.id, 'uploads');

			// shop 데이터 저장, photo 저장, category는 있으면 저장
			const coffeeShop =  await client.coffeeShop.create({
				data : {
					name,
					caption,
					user : {
						connect : {
							id : loggedInUser.id,
						}
					},
					latitude,
					longitude,
					...(categoriesObjs.length > 0 && {
						categories : {
							connectOrCreate : categoriesObjs
						}	
					}),
					photos : {
						create : {
							url : fileUrl
						}
					}
				}
			});
		}),
	}
}