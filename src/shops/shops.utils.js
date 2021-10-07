// # 데이터 추출
export const processCategories = (caption) => {
	const categories = caption.match(/#[^#\s]+/g) || [];		// match result가 null이면 빈 배열을 리턴해줌	
	return categories.map((category) => ({		
		where : {
			category
		},
		create : {
			category
		},
	}));
}