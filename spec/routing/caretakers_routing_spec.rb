require "spec_helper"

describe CaretakersController do
  describe "routing" do

    it "routes to #index" do
      get("/caretakers").should route_to("caretakers#index")
    end

    it "routes to #new" do
      get("/caretakers/new").should route_to("caretakers#new")
    end

    it "routes to #show" do
      get("/caretakers/1").should route_to("caretakers#show", :id => "1")
    end

    it "routes to #edit" do
      get("/caretakers/1/edit").should route_to("caretakers#edit", :id => "1")
    end

    it "routes to #create" do
      post("/caretakers").should route_to("caretakers#create")
    end

    it "routes to #update" do
      put("/caretakers/1").should route_to("caretakers#update", :id => "1")
    end

    it "routes to #destroy" do
      delete("/caretakers/1").should route_to("caretakers#destroy", :id => "1")
    end

  end
end
