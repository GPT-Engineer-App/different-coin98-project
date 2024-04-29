import { useState, useEffect } from "react";
import { Box, Button, Container, Flex, Heading, Input, Stack, Text, useToast, Image, Spinner, Link } from "@chakra-ui/react";
import { FaSearch, FaArrowRight, FaBitcoin, FaEthereum, FaInfoCircle } from "react-icons/fa";
import { client } from "lib/crud";

const Index = () => {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [coinData, setCoinData] = useState(null);
  const toast = useToast();

  useEffect(() => {
    fetchCoinData("bitcoin");
  }, []);

  const fetchCoinData = async (coin) => {
    setLoading(true);
    try {
      const data = await client.get(`coin:${coin}`);
      if (data) {
        setCoinData(data[0].value);
      } else {
        toast({
          title: "Error",
          description: "Couldn't fetch coin data.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Couldn't connect to the database.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
    setLoading(false);
  };

  const handleSearch = () => {
    if (search) {
      fetchCoinData(search.toLowerCase());
    }
  };

  return (
    <Container maxW="container.xl" py={8}>
      <Flex justifyContent="space-between" alignItems="center" mb={6}>
        <Heading as="h1" size="xl">
          Coin98 Explorer
        </Heading>
        <Image src="https://images.unsplash.com/photo-1654089698437-605524531923?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1MDcxMzJ8MHwxfHNlYXJjaHwxfHxjcnlwdG8lMjBjb2luc3xlbnwwfHx8fDE3MTQ0MDgwNTh8MA&ixlib=rb-4.0.3&q=80&w=1080" boxSize="100px" />
      </Flex>
      <Stack spacing={4} direction="row" mb={6}>
        <Input placeholder="Search for a coin (e.g., bitcoin, ethereum)" value={search} onChange={(e) => setSearch(e.target.value)} />
        <Button leftIcon={<FaSearch />} colorScheme="teal" onClick={handleSearch}>
          Search
        </Button>
      </Stack>
      {loading ? (
        <Flex justifyContent="center" alignItems="center" height="200px">
          <Spinner size="xl" />
        </Flex>
      ) : coinData ? (
        <Box p={5} shadow="md" borderWidth="1px">
          <Heading fontSize="xl">
            {coinData.name} <FaInfoCircle />
          </Heading>
          <Text mt={4}>
            <FaBitcoin /> {coinData.symbol.toUpperCase()}
          </Text>
          <Text mt={4}>
            <FaEthereum /> Price: ${coinData.price}
          </Text>
          <Text mt={4}>Market Cap: ${coinData.marketCap}</Text>
          <Text mt={4}>Total Supply: {coinData.totalSupply}</Text>
          <Link href={coinData.website} isExternal color="teal.500">
            Visit Website <FaArrowRight />
          </Link>
        </Box>
      ) : (
        <Text>No data available. Please search for a coin.</Text>
      )}
    </Container>
  );
};

export default Index;
