const { DOMAIN, ARVAN_API_KEY, SERVER_IP } = process.env;

const aRecords = ["app", "merchant", "moderation"];

async function createARecord(name) {
  return fetch(
    `https://napi.arvancloud.ir/cdn/4.0/domains/${DOMAIN}/dns-records`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `${ARVAN_API_KEY}`,
      },
      method: "POST",
      body: JSON.stringify({
        name,
        type: "a",
        value: [{ ip: SERVER_IP }],
        ttl: 120,
        upstream_https: "default",
      }),
    }
  );
}

async function updateRecord(record) {
  return fetch(
    `https://napi.arvancloud.ir/cdn/4.0/domains/${DOMAIN}/dns-records/${record.id}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `${ARVAN_API_KEY}`,
      },
      method: "PUT",
      body: JSON.stringify({
        value: [{ ip: SERVER_IP }],
      }),
    }
  );
}

async function main() {
  const response = await fetch(
    `https://napi.arvancloud.ir/cdn/4.0/domains/${DOMAIN}/dns-records`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `${ARVAN_API_KEY}`,
      },
    }
  ).then((res) => res.json());

  const exists = response.data.filter(
    (record) =>
      record.type.toLowerCase() === "a" &&
      aRecords.includes(record.name) &&
      record.value[0].ip !== SERVER_IP
  );

  console.log("exists", exists);

  for (const record of exists) {
    await updateRecord(record);
  }

  const submittedRecords = exists.map((record) => record.name);
  const remaining = aRecords.filter((name) => !submittedRecords.includes(name));

  console.log("submittedRecords", submittedRecords);
  console.log("remaining", remaining);

  for (const name of remaining) {
    try {
      await createARecord(name);
    } catch (e) {
      console.log(e);
    }
  }
}

main().then(() => {
  console.log("script ran successfully");
});
