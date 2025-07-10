echo "" > csp-hash
for f in ../docs/*.html
do
	echo $f >> csp-hash
	npx csp-hash $f >> csp-hash
done

