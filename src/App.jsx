import { useEffect, useState } from "react";
import {
	Row,
	Input,
	Text,
	Container,
	Spacer,
	Textarea,
	Checkbox,
	Grid,
} from "@nextui-org/react";
import { faCopy, faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";

function App() {
	const env = import.meta.env;
	const minLength = 1;
	const maxLength = 100;
	const defaultState = 50;
	const [length, setLength] = useState(defaultState);
	const [copy, setCopy] = useState(false);
	const [pwd, setPwd] = useState("");
	const [upper, setUpper] = useState(true);
	const [lower, setLower] = useState(true);
	const [numbers, setNumbers] = useState(true);
	const [symbols, setSymbols] = useState(true);
	const [security, setSecurity] = useState("");
	const [status, setStatus] = useState("");

	const handlePwd = () =>
		axios
			.post(env.VITE_SERVER_URL, {
				length,
				useData: { upper, lower, numbers, symbols },
			})
			.then((res) => setPwd(res.data.password));

	const handleSecurity = () => {
		if (length >= minLength && length < 30) {
			setSecurity("error");
			setStatus("Weak");
		} else if (length >= 30 && length < 50) {
			setSecurity("warning");
			setStatus("Average");
		} else if (length >= 50 && length < 80) {
			setSecurity("primary");
			setStatus("Strong");
		} else if (length >= 80) {
			setSecurity("success");
			setStatus("Very strong");
		}
	};

	useEffect(() => {
		setCopy(false);

		handlePwd();

		handleSecurity();
	}, [length, upper, lower, numbers, symbols]);

	return (
		<Container align="center" justify="center">
			<Row align="center" justify="center">
				<Text h1 style={{ fontSize: "8vw" }}>
					Passgen
				</Text>
			</Row>
			<Row align="center" justify="center">
				<Text h4 color={security} style={{ fontSize: "4vw" }}>
					Generate more secure passwords.
				</Text>
			</Row>
			<Spacer y={1}></Spacer>
			<Row align="center" justify="center">
				<Text h3>
					Your generated password
					<FontAwesomeIcon
						icon={copy ? faCheck : faCopy}
						onClick={() => {
							if (copy === false) {
								navigator.clipboard.writeText(pwd);
								console.log(
									`Your generated password has been saved to clipboard (${pwd.length} characters):
									${pwd}.`
								);
								setCopy(true);
							}
						}}
						style={
							!copy
								? {
										cursor: "pointer",
										opacity: "0.7",
										position: "relative",
										marginLeft: "10px",
								  }
								: {
										position: "relative",
										marginLeft: "10px",
										color: "green",
								  }
						}
					/>
				</Text>
			</Row>
			<Row>
				<Grid.Container gap={2} align="center" justify="center">
					<Grid>
						<Row align="center" justify="center">
							<div id="finalPwd-container">
								<Textarea
									id="finalPwd"
									status={security}
									value={pwd}
									readOnly
								/>
							</div>
						</Row>
						<Row align="center" justify="center">
							<Text color={security} h4>
								{status}
							</Text>
						</Row>
					</Grid>
					<Grid>
						<Row>
							<Container>
								<Input
									className="length"
									label="Length"
									underlined
									color={security}
									value={length}
									type="number"
									inputMode="numeric"
									onChange={(e) => {
										const current = e.target.value;
										if (current > maxLength) e.target.value = maxLength;
										setLength(e.target.value);
									}}
									onInput={(e) => {
										const current = e.target.value;
										if (current > maxLength) e.target.value = maxLength;
									}}
									style={{
										maxWidth: "600px",
										margin: "auto",
										textAlign: "center",
									}}
									size="xl"
								/>
							</Container>
						</Row>
						<Spacer y={1}></Spacer>
						<Row>
							<input
								id="slider"
								className={security}
								type="range"
								min={minLength}
								max={maxLength}
								onChange={(e) => {
									const current = e.target.value;
									setLength(current);
								}}
								value={length}
							/>
						</Row>
						<Spacer y={0.5}></Spacer>
						<Row>
							<Grid.Container gap={2} justify="center">
								<Grid>
									<Checkbox
										color={security}
										defaultSelected={upper}
										onChange={(e) => setUpper(!upper)}
									>
										Uppercase
									</Checkbox>
								</Grid>
								<Grid>
									<Checkbox
										color={security}
										defaultSelected={lower}
										onChange={(e) => setLower(!lower)}
									>
										Lowercase
									</Checkbox>
								</Grid>
								<Grid>
									<Checkbox
										color={security}
										defaultSelected={numbers}
										onChange={(e) => setNumbers(!numbers)}
									>
										Numbers
									</Checkbox>
								</Grid>
								<Grid>
									<Checkbox
										color={security}
										defaultSelected={symbols}
										onChange={(e) => setSymbols(!symbols)}
									>
										Symbols
									</Checkbox>
								</Grid>
							</Grid.Container>
						</Row>
					</Grid>
				</Grid.Container>
			</Row>
			<Spacer y={2}></Spacer>
		</Container>
	);
}

export default App;
