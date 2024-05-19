const { DOMAIN, ARVAN_API_KEY } = process.env;

async function main() {
  const response = await fetch(
    `https://napi.arvancloud.ir/cdn/4.0/domains/${DOMAIN}/dns-records`
  ).then((res) => res.json);
  console.log(response);
}

main().then(() => {
  console.log("script ran successfully");
});
