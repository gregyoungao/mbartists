// WordPress GraphQL Client
const WORDPRESS_API_URL = process.env.WORDPRESS_GRAPHQL_URL || 'https://anti-ordinary.co/mbartists/graphql'

interface GraphQLResponse<T> {
  data?: T
  errors?: Array<{ message: string }>
}

export async function fetchGraphQL<T>(
  query: string,
  variables?: Record<string, unknown>
): Promise<T> {
  const res = await fetch(WORDPRESS_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 60 }, // Revalidate every 60 seconds
  })

  const json: GraphQLResponse<T> = await res.json()

  if (json.errors) {
    console.error('GraphQL Errors:', json.errors)
    throw new Error(json.errors[0]?.message || 'GraphQL Error')
  }

  if (!json.data) {
    throw new Error('No data returned from GraphQL')
  }

  return json.data
}

// ============================================
// TYPES
// ============================================

export interface WPImage {
  sourceUrl: string
  altText: string
  mediaDetails?: {
    width: number
    height: number
  }
}

export interface Genre {
  id: string
  name: string
  slug: string
}

export interface Location {
  id: string
  name: string
  slug: string
}

export interface Agent {
  id: string
  slug: string
  agentFields: {
    agentName: string
    agentPhoto: WPImage
    email: string
    agentBio: string
    agentRole: string[]
    agentInstagram?: string
    agentLinkedin?: string
  }
}

export interface Artist {
  id: string
  slug: string
  artistFields: {
    artistName: string
    artistImage: WPImage
    artistAgent: Agent
    artitsSmallBio: string
    artistLargeBio: string
    academyArtist: boolean
    featuredArtist: boolean
    artistInstagram?: string
    artistSpotify?: string
    artistsSoundcloud?: string
    artistFacebook?: string
    artistTiktok?: string
    artistSpotlight1?: string
    artistSpotlight2?: string
    artistSpotlight3?: string
    artistSpotlight4?: string
  }
  genres: {
    nodes: Genre[]
  }
  locations: {
    nodes: Location[]
  }
}

// ============================================
// QUERIES
// ============================================

const ARTIST_FIELDS = `
  id
  slug
  artistFields {
    artistName
    artistImage {
      sourceUrl
      altText
      mediaDetails {
        width
        height
      }
    }
    artistAgent {
      ... on Agent {
        id
        slug
        agentFields {
          agentName
          agentPhoto {
            sourceUrl
            altText
          }
          email
        }
      }
    }
    artitsSmallBio
    artistLargeBio
    academyArtist
    featuredArtist
    artistInstagram
    artistSpotify
    artistsSoundcloud
    artistFacebook
    artistTiktok
    artistSpotlight1
    artistSpotlight2
    artistSpotlight3
    artistSpotlight4
  }
  genres {
    nodes {
      id
      name
      slug
    }
  }
  locations {
    nodes {
      id
      name
      slug
    }
  }
`

const AGENT_FIELDS = `
  id
  slug
  agentFields {
    agentName
    agentPhoto {
      sourceUrl
      altText
      mediaDetails {
        width
        height
      }
    }
    email
    agentBio
    agentRole
    agentInstagram
    agentLinkedin
  }
`

// ============================================
// FETCH FUNCTIONS
// ============================================

export async function getAllArtists(): Promise<Artist[]> {
  const query = `
    query GetAllArtists {
      artists(first: 200, where: { orderby: { field: TITLE, order: ASC } }) {
        nodes {
          ${ARTIST_FIELDS}
        }
      }
    }
  `

  const data = await fetchGraphQL<{ artists: { nodes: Artist[] } }>(query)
  return data.artists.nodes
}

export async function getFeaturedArtists(): Promise<Artist[]> {
  const query = `
    query GetFeaturedArtists {
      artists(first: 50, where: { orderby: { field: TITLE, order: ASC } }) {
        nodes {
          ${ARTIST_FIELDS}
        }
      }
    }
  `

  const data = await fetchGraphQL<{ artists: { nodes: Artist[] } }>(query)
  // Filter for featured artists client-side since ACF meta queries may need additional setup
  return data.artists.nodes.filter(a => a.artistFields.featuredArtist)
}

export async function getArtistBySlug(slug: string): Promise<Artist | null> {
  const query = `
    query GetArtistBySlug($slug: ID!) {
      artist(id: $slug, idType: SLUG) {
        ${ARTIST_FIELDS}
      }
    }
  `

  const data = await fetchGraphQL<{ artist: Artist | null }>(query, { slug })
  return data.artist
}

export async function getArtistNames(): Promise<string[]> {
  const query = `
    query GetArtistNames {
      artists(first: 200, where: { orderby: { field: TITLE, order: ASC } }) {
        nodes {
          artistFields {
            artistName
          }
        }
      }
    }
  `

  const data = await fetchGraphQL<{ artists: { nodes: { artistFields: { artistName: string } }[] } }>(query)
  return data.artists.nodes.map(a => a.artistFields.artistName)
}

export async function getAllAgents(): Promise<Agent[]> {
  const query = `
    query GetAllAgents {
      agents(first: 50, where: { orderby: { field: TITLE, order: ASC } }) {
        nodes {
          ${AGENT_FIELDS}
        }
      }
    }
  `

  const data = await fetchGraphQL<{ agents: { nodes: Agent[] } }>(query)
  return data.agents.nodes
}

export async function getAgentBySlug(slug: string): Promise<Agent | null> {
  const query = `
    query GetAgentBySlug($slug: ID!) {
      agent(id: $slug, idType: SLUG) {
        ${AGENT_FIELDS}
      }
    }
  `

  const data = await fetchGraphQL<{ agent: Agent | null }>(query, { slug })
  return data.agent
}

export async function getAgentWithRoster(slug: string): Promise<{ agent: Agent | null; roster: Artist[] }> {
  const agent = await getAgentBySlug(slug)
  if (!agent) return { agent: null, roster: [] }

  // Get all artists and filter by agent
  const allArtists = await getAllArtists()
  const roster = allArtists.filter(a => a.artistFields.artistAgent?.slug === slug)

  return { agent, roster }
}

export async function getAllGenres(): Promise<Genre[]> {
  const query = `
    query GetAllGenres {
      genres(first: 100) {
        nodes {
          id
          name
          slug
        }
      }
    }
  `

  const data = await fetchGraphQL<{ genres: { nodes: Genre[] } }>(query)
  return data.genres.nodes
}

export async function getAllLocations(): Promise<Location[]> {
  const query = `
    query GetAllLocations {
      locations(first: 100) {
        nodes {
          id
          name
          slug
        }
      }
    }
  `

  const data = await fetchGraphQL<{ locations: { nodes: Location[] } }>(query)
  return data.locations.nodes
}

// ============================================
// HELPER FUNCTIONS
// ============================================

export function getArtistSpotlights(artist: Artist): string[] {
  const { artistSpotlight1, artistSpotlight2, artistSpotlight3, artistSpotlight4 } = artist.artistFields
  return [artistSpotlight1, artistSpotlight2, artistSpotlight3, artistSpotlight4].filter(Boolean) as string[]
}

// Group artists by location for the map
export function groupArtistsByLocation(artists: Artist[]): Record<string, Artist[]> {
  const grouped: Record<string, Artist[]> = {}
  
  artists.forEach(artist => {
    artist.locations.nodes.forEach(loc => {
      if (!grouped[loc.name]) {
        grouped[loc.name] = []
      }
      grouped[loc.name].push(artist)
    })
  })

  return grouped
}
