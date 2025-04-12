import { json } from '@tanstack/react-start'
import { createAPIFileRoute } from '@tanstack/react-start/api'
import { updateProfile } from '~/actions/profile'
import { createClient } from '~/lib/supabase/server'

export const APIRoute = createAPIFileRoute('/api/verify-token')({

    GET: async ({ request, params }) => {
        console.log('verify-token')
        console.log(request.url)
        const { searchParams, origin } = new URL(request.url)
        const code = searchParams.get('code')
        const userType = searchParams.get('userType') as PrismaJson.UserType || 'buyer' // Default to buyer if not specified
        // if "next" is in param, use it as the redirect URL
        const next = searchParams.get('next') ?? '/dashboard'
        if (code) {
            const supabase = await createClient()
            const { error } = await supabase.auth.exchangeCodeForSession(code)
            if (!error) {
                // Get the current user
                const { data: { user } } = await supabase.auth.getUser()
                
                if (user) {
                    // Update user metadata with userType if it doesn't exist
                    if (!user.user_metadata.userType) {
                        await supabase.auth.updateUser({
                            data: { userType }
                        })
                        updateProfile({data:{
                            userType: userType
                        }})
                    }
                }
                
                const forwardedHost = request.headers.get('x-forwarded-host') // original origin before load balancer
                const isLocalEnv = process.env.NODE_ENV === 'development'
                if (isLocalEnv) {
                    // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
                    return redirect(`${origin}${next}`)
                } else if (forwardedHost) {
                    return redirect(`https://${forwardedHost}${next}`)
                } else {
                    return redirect(`${origin}${next}`)
                }
            }
        }
        // return the user to an error page with instructions
        return redirect(`${origin}/auth/auth-code-error`)
    },
})

function redirect(url: string) {
    return new Response(null, {
        status: 302,
        headers: {
            Location: url,
        },
    })
}