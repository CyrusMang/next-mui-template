import { useQuery } from 'urql'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
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
  
  console.log(result)
  
  return (
    <Container maxwidth='xl'>
      <Typography variant="h5">
        {"hello"}
      </Typography>
    </Container>
  )
}

export default Home