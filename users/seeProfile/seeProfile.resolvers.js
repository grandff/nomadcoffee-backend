import client from "../../client";

export default {
	Query : {
		seeProfile : (_, {username}) => client.user.findUnique({
			where : {
				username
			},
			/*
			// 지금은 팔로윙 팔로워 뺐는데 복습겸 다시 넣는것도 괜찮을듯? 근데 그거 감안하더라도 넣는게 맞나
			include : {
				following
				follower
			}
			*/
		})
	}
}