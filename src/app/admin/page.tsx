import { insertUser, queryUsers } from "@/lib/db"

export default function Teste(){
    insertUser('José da silva', 'joseDaSilva@email.com', 'senha12313124')
    // queryUsers()
    return <h1>ola</h1>
}