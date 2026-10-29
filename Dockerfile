# Build the API using the .NET SDK
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY src/WMS.API/WMS.API.csproj src/WMS.API/
RUN dotnet restore src/WMS.API/WMS.API.csproj

COPY src/WMS.API/ src/WMS.API/
RUN dotnet publish src/WMS.API/WMS.API.csproj \
    -c Release \
    -o /app/publish \
    --no-restore

# Run the published API using the smaller ASP.NET runtime
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app

COPY --from=build /app/publish .
ENV ASPNETCORE_ENVIRONMENT=Production

CMD ["sh", "-c", "exec dotnet WMS.API.dll --urls http://0.0.0.0:${PORT:-8080}"]