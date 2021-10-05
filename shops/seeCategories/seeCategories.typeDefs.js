import {gql} from "apollo-server"

export default gql`
	type Query {
		seeCategories(offset : Int!) : [Category]
	}
`