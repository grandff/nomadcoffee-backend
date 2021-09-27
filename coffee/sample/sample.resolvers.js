import client from "../../client";

export default {
	Mutation : {
		createSample : (_, {title, year, genre}) => client.sample.create({data : {
            title, year, genre
        }}),
        deleteSample : (_, {id}) => client.sample.delete({where : {id}}),
        updateSample : (_, {id, year}) => client.sample.update({where : {id}, data : {year}})	
	},
	
	Query : {
		samples : () => client.sample.findMany(),
        sample : (_, {id}) => client.sample.findUnique({where : {id}})
	}
}