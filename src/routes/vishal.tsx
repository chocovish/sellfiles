import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { dummy, s1 } from '@/actions/test'
import { getUserProfile } from '~/actions/profile'
// import { dummy } from '~/actions/profile'

export const Route = createFileRoute('/vishal')({
    component: RouteComponent,
})

function RouteComponent() {
    const {data} =  useQuery({
        queryKey: ['vishal'],
        queryFn: getUserProfile,
    })
    return <div>Hello...{data?.id}</div>
}

