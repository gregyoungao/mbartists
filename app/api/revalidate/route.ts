import { revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

// Secret token to validate webhook requests from WordPress
const REVALIDATION_SECRET = process.env.REVALIDATION_SECRET

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { secret, type, slug } = body

    // Validate secret token
    if (REVALIDATION_SECRET && secret !== REVALIDATION_SECRET) {
      return NextResponse.json({ message: 'Invalid secret' }, { status: 401 })
    }

    // Revalidate based on content type
    switch (type) {
      case 'artist':
        revalidateTag('artists', 'max')
        revalidateTag('featured-artists', 'max')
        revalidateTag('artist-names', 'max')
        if (slug) {
          revalidateTag(`artist-${slug}`, 'max')
        }
        break
      case 'agent':
        revalidateTag('agents', 'max')
        if (slug) {
          revalidateTag(`agent-${slug}`, 'max')
        }
        break
      case 'genre':
        revalidateTag('genres', 'max')
        revalidateTag('artists', 'max')
        break
      case 'location':
        revalidateTag('locations', 'max')
        revalidateTag('artists', 'max')
        break
      default:
        // Revalidate everything
        revalidateTag('artists', 'max')
        revalidateTag('agents', 'max')
        revalidateTag('genres', 'max')
        revalidateTag('locations', 'max')
    }

    return NextResponse.json({ revalidated: true, type, slug })
  } catch (error) {
    console.error('Revalidation error:', error)
    return NextResponse.json({ message: 'Error revalidating' }, { status: 500 })
  }
}
