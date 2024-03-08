import "regenerator-runtime/runtime";
import AppSearchAPIConnector from "@elastic/search-ui-app-search-connector";

// @ts-ignore
const connector = new AppSearchAPIConnector({
  searchKey: "search-a715oxezv1fjmuznv2g1mhon",
  engineName: "notices",
  endpointBase: "https://dealfortress.ent.francecentral.azure.elastic-cloud.com"
});

const config = {
  debug: true,
  apiConnector: connector,
  searchQuery: {
    disjunctiveFacets: ["title", "description", "city"],
    facets: {
      title: {
        type: "value"
      },
      description: {
        type: "value"
      },
      city: {
        type: "value"
      },
    }
  }
};

export default config;