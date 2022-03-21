import { useQuery } from 'urql'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import Typography from '@mui/material/Typography'

const query = /* GraphQL */ `
  query Post {
    posts {
      id
      title
      author {
        firstName
      }
    }
  }
`

const Home = () => {
  const [result, reexecuteQuery] = useQuery({ query })
  
  const { data, fetching, error } = result
  
  if (fetching) {
    return '...'
  }
  if (error) {
    return 'error'
  } 
  
  return (
    <List>
      {data.posts.map(post => (
        <ListItem key={post.id}>
          <Typography variant="h5">
            {post.title}
          </Typography>
        </ListItem>
      ))}
    </List>
  )
}

export default Home