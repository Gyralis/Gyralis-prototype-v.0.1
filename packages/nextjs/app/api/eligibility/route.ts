// api/eligibility/
import { NextResponse } from "next/server";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

// import { getConfigByChain } from "@/configs/chains";

const getApolloClient = (subgraphUrl: string) => {
  return new ApolloClient({
    uri: subgraphUrl,
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: { fetchPolicy: "no-cache" },
      query: { fetchPolicy: "no-cache" },
    },
  });
};

export async function POST(req: Request) {
  try {
    const { chainId, userAddress } = await req.json();
    if (!chainId || !userAddress) {
      return NextResponse.json({ success: false, error: "Missing parameters" }, { status: 400 });
    }

    // Get the subgraph URL for the provided chainId
    // Just for the prototype going to hardcode the subgraph url since we are only using gnosis and when we want to test on sepolia also we are going to query the gnosis subgraph
    // const chainConfig = getConfigByChain(chainId);
    const subgraphUrl = "https://api.studio.thegraph.com/query/102093/gardens-v2---gnosis/0.1.12";
    if (!subgraphUrl) {
      return NextResponse.json({ success: false, error: "Invalid chain ID" }, { status: 400 });
    }

    const apolloClient = getApolloClient(subgraphUrl);

    const { data, errors } = await apolloClient.query({
      query: gql`
        query MyQuery($userAddress: String!) {
          memberCommunities(
            where: { registryCommunity: "0xe2396fe2169ca026962971d3b2e373ba925b6257", memberAddress: $userAddress }
          ) {
            memberAddress
          }
        }
      `,
      variables: { userAddress: userAddress.toLowerCase() },
    });

    if (errors) {
      return NextResponse.json({ success: false, error: "Subgraph query failed" }, { status: 500 });
    }

    const isMember = data?.memberCommunities?.length > 0;

    return NextResponse.json({ success: true, isMember });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
