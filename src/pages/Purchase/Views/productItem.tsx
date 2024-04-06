import { 
    Card, 
    CardBody, 
    Heading, 
    Stack,
    Image,
    Text,
    Divider,
    Button,
    ButtonGroup,
    CardFooter
} from "@chakra-ui/react";
import React from "react";

const ProductItem = ({ product }: any)  => {
  return (
    <Card maxW="sm">
      <CardBody>
        <Image
          src={product.imageUrl}
          alt={product.productName}
          borderRadius="lg"
        />
        <Stack mt="6" spacing="3">
          <Heading size="md">{product.productName}</Heading>
          <Text>{product.description}</Text>
          <Text color="blue.600" fontSize="2xl">
            {`${product.price} ${product.currency}`}
          </Text>
        </Stack>
      </CardBody>
      <Divider />
      <CardFooter>
        <ButtonGroup spacing="2">
          <Button variant="solid" colorScheme="blue">
            Buy now
          </Button>
          <Button variant="ghost" colorScheme="blue">
            Add to cart
          </Button>
        </ButtonGroup>
      </CardFooter>
    </Card>
  );
};

export default ProductItem;
